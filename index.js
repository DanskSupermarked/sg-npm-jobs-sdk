const Traverser = require('@salling-group/pagination-traverser');
const { createInstance } = require('@salling-group/auth');
const { version } = require('./package');

const BASE_URL = '/v1/jobs/';

/**
 * A query builder for querying jobs.
 */
class JobsQuery {
  /**
   * Construct a new query builder.
   * @param {JobsAPI} jobsAPI A handle to JobsAPI.
   */
  constructor(jobsAPI) {
    this.jobsAPI = jobsAPI;
    this.params = {};
  }

  /**
   * Set a parameter for the request being built.
   *
   * @param {string} param The param name.
   * @param {*} value The value to set.
   */
  set(param, value) {
    this.params[param] = value;
  }

  /**
   * Return only the given fields.
   *
   * @param  {string} fields The fields to return.
   * @returns {JobsQuery}
   */
  pick(...fields) {
    this.params.fields = fields.join(',');
    return this;
  }

  /**
   * Return only jobs of the given brand.
   *
   * @param {string} brand The brand to filter by.
   * @returns {JobsQuery}
   */
  ofBrand(brand) {
    this.set('brand', brand);
    return this;
  }

  /**
   * Returns only jobs in the given country.
   *
   * @param {string} country The country to filter by.
   * @returns {JobsQuery}
   */
  inCountry(country) {
    this.set('country', country);
    return this;
  }

  /**
   * Return only jobs in the given city.
   *
   * @param {string} city The city to filter by.
   * @returns {JobsQuery}
   */
  inCity(city) {
    this.set('city', city);
    return this;
  }

  /**
   * Returns only jobs in the given ZIP code.
   *
   * @param {string} zip The ZIP code to filter by.
   * @returns {JobsQuery}
   */
  inZIP(zip) {
    this.set('zip', zip);
    return this;
  }

  /**
   * Executes the query.
   *
   * @returns {Traverser} A traverser to use for iteration.
   */
  execute() {
    return this.jobsAPI.query(this.params);
  }
}

/**
 * Wraps the Salling Group Jobs API.
 */
class JobsAPI {
  /**
   * Initialize a new Jobs API wrapper.
   *
   * @param {Object} options Options for the instance.
   * @param {Object} options.auth Credentials for the instance.
   * @param {String} options.auth.type The type of authentication.
   * @param {String} [options.auth.email] The email used for JWT.
   * @param {String} [options.auth.secret] The secret used for JWT.
   * @param {String} [options.auth.token] The token used for Bearer.
   * @param {String} [options.applicationName]
   * The name of the application which will use this instance.
   * This will be sent in the user-agent header.
   */
  constructor(options) {
    this.instance = createInstance({
      ...options,
      'baseName': `Holidays SDK v${version}`,
    });
  }

  /**
   * Get a specific job.
   *
   * @param jobID The ID of the job.
   * @returns {Promise<Object|null>} Returns the job. If it cannot be found, then it returns null.
   */
  async get(jobID) {
    try {
      const result = await this.instance.get(`${BASE_URL}${jobID}`);
      return result.data;
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Query jobs based on search parameters.
   *
   * @param {Object} params The search parameters.
   * @returns {Traverser} A traverser to use for iteration over the jobs.
   */
  query(params = {}) {
    return new Traverser(this.instance, BASE_URL, { 'params': params });
  }

  /**
   * Get all jobs.
   *
   * @returns {Traverser} A traverser to use for iteration over the jobs.
   */
  getAll() {
    return this.query();
  }

  /**
   * Begin a job query. This supports chain calling. Execute the query by running .execute().
   *
   * @returns {JobsQuery} The query to be built. Execute with .execute().
   */
  beginQuery() {
    return new JobsQuery(this);
  }
}

module.exports = JobsAPI;
