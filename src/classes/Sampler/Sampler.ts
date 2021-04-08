type ExternalTickHandlerFunction = (tickNumber: number) => Promise<void>;

class Sampler {
  private _active: boolean;
  private _internalTickHandler: NodeJS.Timeout | null;
  private _internalTickInterval: number;
  private _lastExternalTickNumber: number;
  private _externalTickHandler: ExternalTickHandlerFunction | null;

  /**
   * @description Class representing whole app time sampler
   */
  public constructor() {
    this._internalTickHandler = null;
    this._active = false;
    this._internalTickInterval = 100;
    this._lastExternalTickNumber = 0;
    this._externalTickHandler = null;
  }

  /**
   * @description Is sampler active
   */
  public get Active() {
    return this._active;
  }

  /**
   * @description Last external tick date
   */
  public get LastExternalTickNumber() {
    return this._lastExternalTickNumber;
  }

  /**
   * @description interval in ms between internal ticks
   */
  public get InternalTickInterval() {
    return this._internalTickInterval;
  }

  /**
   * @description Method invoked on every external tick, (externalTickNumber) => {}
   */
  public get ExternalTickHandler() {
    return this._externalTickHandler;
  }

  /**
   * @description Method invoked on every external tick, (externalTickNumber) => {}
   */
  public set ExternalTickHandler(value: ExternalTickHandlerFunction | null) {
    this._externalTickHandler = value;
  }

  /**
   * @description Method for starting sampling of sampler
   */
  public start() {
    if (!this.Active) {
      this._internalTickHandler = setInterval(
        async () => await this._onInternalTick(),
        this._internalTickInterval
      );
      this._active = true;
    }
  }

  /**
   * @description Method for stop sampling
   */
  public stop() {
    if (this.Active) {
      if (this._internalTickHandler != null)
        clearInterval(this._internalTickHandler);

      this._internalTickHandler = null;
      this._active = false;
    }
  }

  /**
   * @description Method called every tick of Interval handler
   */
  private async _onInternalTick() {
    //Invoking only if sampler is active
    if (this.Active) {
      let tickNumber = Sampler.convertDateToTickNumber(Date.now());
      if (
        this._shouldExternalTickBeEmitted(tickNumber) &&
        this.ExternalTickHandler != null
      ) {
        //Preventing tick method for throwing
        try {
          this._lastExternalTickNumber = tickNumber;

          await this.ExternalTickHandler(tickNumber);
        } catch (err) {}
      }
    }
  }

  /**
   * @description Should tick be emitted based on last tick time?
   * @param {number} tickNumber Actual tick time
   */
  private _shouldExternalTickBeEmitted(tickNumber: number) {
    return tickNumber !== this._lastExternalTickNumber;
  }

  /**
   * @description Doest TickId matches actual tick?
   * @param {number} tickNumber Actual tick
   * @param {number} sampleTime TickId to be checked
   */
  public static doesSampleTimeMatchesTick(
    tickNumber: number,
    sampleTime: number
  ) {
    return tickNumber % sampleTime === 0;
  }

  /**
   * @description Converting date to tick number
   * @param {number} date Date to be converted
   */
  public static convertDateToTickNumber(date: number) {
    return Math.round(date / 1000);
  }

  /**
   * @description Converting tick number to date in unix
   * @param {number} tickNumber tick to be converted
   */
  public static convertTickNumberToDate(tickNumber: number) {
    return tickNumber * 1000;
  }

  //#endregion ========= PUBLIC STATIC METHODS =========
}

export default Sampler;

//TODO - test this class
