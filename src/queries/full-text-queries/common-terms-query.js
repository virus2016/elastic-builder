'use strict';

const isObject = require('lodash.isobject'),
    has = require('lodash.has');

const MonoFieldQueryBase = require('./mono-field-query-base');

const ES_REF_URL = 'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-common-terms-query.html';

/**
 * The `common` terms query is a modern alternative to stopwords which
 * improves the precision and recall of search results (by taking
 * stopwords into account), without sacrificing performance.
 * [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-common-terms-query.html)
 *
 * @extends MonoFieldQueryBase
 */
class CommonTermsQuery extends MonoFieldQueryBase {

    /**
     * Creates an instance of `CommonTermsQuery`
     *
     * @param {string=} field The document field to query against
     * @param {string=} queryString The query string
     */
    constructor(field, queryString) {
        super('common', field, queryString);
    }

    /**
     * Print warning message to console namespaced by class name.
     *
     * @param {string} msg
     * @private
     */
    _warn(msg) {
        console.warn(`[${this.constructor.name}] ${msg}`);
    }

    /**
     * Print warning messages to not mix Geo Point representations
     * @private
     */
    _warnMixedRepr() {
        this._warn('Do not mix with other representation!');
        this._warn('Overwriting.');
    }

    /**
     * Check the instance for object representation of Geo Point.
     * If representation is null, new object is initialised.
     * If it is not null, warning is logged and point is overwritten.
     * @private
     */
    _checkMinMatchRepr() {

        if (!has(this._queryOpts, 'minimum_should_match')) {
            this._queryOpts.minimum_should_match = {};
        } else if (!isObject(this._queryOpts.minimum_should_match)) {
            this._warnMixedRepr();
            this._queryOpts.minimum_should_match = {};
        }
    }

    /**
     * Allows specifying an absolute or relative document frequency where high frequency
     * terms are moved into an optional subquery and are only scored if one of the
     * low frequency (below the cutoff) terms in the case of an `or` operator or
     * all of the low frequency terms in the case of an `and` operator match.
     *
     * @param {number} frequency It can either be relative to the total number of documents
     * if in the range `[0..1)` or absolute if greater or equal to `1.0`.
     * @returns {CommonTermsQuery} returns `this` so that calls can be chained.
     */
    cutoffFrequency(frequency) {
        this._queryOpts.cutoff_frequency = frequency;
        return this;
    }

    /**
     * The operator to be used on low frequency terms in the boolean query
     * which is constructed by analyzing the text provided. The `operator` flag
     * can be set to `or` or `and` to control the boolean clauses (defaults to `or`).
     *
     * @param {string} operator Can be `and`/`or`. Default is `or`.
     * @returns {MatchQuery} returns `this` so that calls can be chained.
     */
    lowFreqOperator(operator) {
        const operatorLower = operator.toLowerCase();
        if (operatorLower !== 'and' && operatorLower !== 'or') {
            console.log(`See ${ES_REF_URL}`);
            console.warn(`Got 'low_freq_operator' - ${operator}`);
            throw new Error('The operator parameter can only be `and` or `or`');
        }

        this._queryOpts.low_freq_operator = operatorLower;
        return this;
    }

    /**
     * The operator to be used on high frequency terms in the boolean query
     * which is constructed by analyzing the text provided. The `operator` flag
     * can be set to `or` or `and` to control the boolean clauses (defaults to `or`).
     *
     * @param {string} operator Can be `and`/`or`. Default is `or`.
     * @returns {MatchQuery} returns `this` so that calls can be chained.
     */
    highFreqOperator(operator) {
        const operatorLower = operator.toLowerCase();
        if (operatorLower !== 'and' && operatorLower !== 'or') {
            console.log(`See ${ES_REF_URL}`);
            console.warn(`Got 'high_freq_operator' - ${operator}`);
            throw new Error('The operator parameter can only be `and` or `or`');
        }

        this._queryOpts.high_freq_operator = operatorLower;
        return this;
    }

    /**
     * Sets the value controlling how many "should" clauses in the resulting boolean
     * query should match for low frequency terms. It can be an absolute value (2),
     * a percentage (30%) or a combination of both.
     *
     * @param {string|number} lowFreqMinMatch
     * @returns {CommonTermsQuery} returns `this` so that calls can be chained.
     */
    lowFreq(lowFreqMinMatch) {
        this._checkMinMatchRepr();

        this._queryOpts.minimum_should_match.low_freq = lowFreqMinMatch;
        return this;
    }

    /**
     * Sets the value controlling how many "should" clauses in the resulting boolean
     * query should match for high frequency terms. It can be an absolute value (2),
     * a percentage (30%) or a combination of both.
     *
     * @param {string|number} highFreqMinMatch
     * @returns {CommonTermsQuery} returns `this` so that calls can be chained.
     */
    highFreq(highFreqMinMatch) {
        this._checkMinMatchRepr();

        this._queryOpts.minimum_should_match.high_freq = highFreqMinMatch;
        return this;
    }

    /**
     * Enables or disables similarity coordinate scoring of documents
     * commoning the `CommonTermsQuery`. Default: false.

     * @param {boolean} enable
     * @returns {CommonTermsQuery} returns `this` so that calls can be chained.
     */
    disableCoord(enable) {
        this._queryOpts.disable_coord = enable;
        return this;
    }
}

module.exports = CommonTermsQuery;