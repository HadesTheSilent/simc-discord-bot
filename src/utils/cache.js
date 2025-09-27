const NodeCache = require('node-cache');

class CacheManager {
    constructor() {
        // Cache com TTL de 1 hora por padrão
        this.ttl = parseInt(process.env.CACHE_TTL) || 3600;
        this.cache = new NodeCache({ 
            stdTTL: this.ttl,
            checkperiod: 600, // Verifica itens expirados a cada 10 minutos
            useClones: false
        });

        console.log(`💾 Cache inicializado com TTL de ${this.ttl} segundos`);
    }

    /**
     * Gera uma chave de cache baseada nos parâmetros da simulação
     * @param {Object} options - Opções da simulação
     * @returns {string} Chave do cache
     */
    generateKey(options) {
        const {
            armoryUrl,
            spec,
            iterations,
            fightStyle,
            extraOptions
        } = options;

        // Normalizar URL do armory (remover parâmetros desnecessários)
        const normalizedUrl = armoryUrl.split('?')[0].toLowerCase();
        
        // Criar chave baseada nos parâmetros principais
        const keyData = {
            url: normalizedUrl,
            spec: spec || 'default',
            iterations: iterations || 1000,
            fightStyle: fightStyle || 'patchwerk',
            extras: (extraOptions || []).sort().join('|')
        };

        return Buffer.from(JSON.stringify(keyData)).toString('base64');
    }

    /**
     * Verifica se existe um resultado em cache
     * @param {Object} options - Opções da simulação
     * @returns {Object|null} Resultado em cache ou null
     */
    get(options) {
        const key = this.generateKey(options);
        const cached = this.cache.get(key);
        
        if (cached) {
            console.log(`🎯 Cache hit para simulação: ${key.substring(0, 12)}...`);
            return {
                ...cached,
                fromCache: true,
                cacheKey: key
            };
        }

        console.log(`❌ Cache miss para simulação: ${key.substring(0, 12)}...`);
        return null;
    }

    /**
     * Armazena um resultado no cache
     * @param {Object} options - Opções da simulação
     * @param {Object} result - Resultado da simulação
     * @param {number} customTTL - TTL customizado (opcional)
     */
    set(options, result, customTTL = null) {
        const key = this.generateKey(options);
        const ttl = customTTL || this.ttl;
        
        // Adicionar metadados ao resultado
        const cachedResult = {
            ...result,
            cachedAt: new Date(),
            cacheKey: key
        };

        this.cache.set(key, cachedResult, ttl);
        console.log(`💾 Resultado armazenado em cache: ${key.substring(0, 12)}... (TTL: ${ttl}s)`);
    }

    /**
     * Remove um item específico do cache
     * @param {Object} options - Opções da simulação
     */
    delete(options) {
        const key = this.generateKey(options);
        const deleted = this.cache.del(key);
        
        if (deleted) {
            console.log(`🗑️ Item removido do cache: ${key.substring(0, 12)}...`);
        }
        
        return deleted > 0;
    }

    /**
     * Limpa todo o cache
     */
    clear() {
        const keys = this.cache.keys();
        this.cache.flushAll();
        console.log(`🧹 Cache limpo: ${keys.length} itens removidos`);
        return keys.length;
    }

    /**
     * Retorna estatísticas do cache
     * @returns {Object} Estatísticas
     */
    getStats() {
        const stats = this.cache.getStats();
        const keys = this.cache.keys();
        
        return {
            keys: keys.length,
            hits: stats.hits,
            misses: stats.misses,
            hitRate: stats.hits / (stats.hits + stats.misses) || 0,
            vsize: stats.vsize,
            ksize: stats.ksize
        };
    }

    /**
     * Lista todas as chaves no cache com informações básicas
     * @returns {Array} Lista de informações das chaves
     */
    listKeys() {
        const keys = this.cache.keys();
        
        return keys.map(key => {
            const value = this.cache.get(key);
            const ttl = this.cache.getTtl(key);
            
            return {
                key: key.substring(0, 12) + '...',
                fullKey: key,
                cachedAt: value?.cachedAt,
                expiresAt: ttl ? new Date(ttl) : null,
                characterName: value?.characterName,
                dps: value?.dps
            };
        });
    }

    /**
     * Remove itens expirados manualmente
     */
    cleanup() {
        const beforeKeys = this.cache.keys().length;
        // O node-cache faz limpeza automática, mas podemos forçar
        this.cache.keys().forEach(key => {
            this.cache.get(key); // Isso força a verificação de TTL
        });
        const afterKeys = this.cache.keys().length;
        
        if (beforeKeys !== afterKeys) {
            console.log(`🧹 Limpeza do cache: ${beforeKeys - afterKeys} itens expirados removidos`);
        }
        
        return beforeKeys - afterKeys;
    }
}

module.exports = new CacheManager();