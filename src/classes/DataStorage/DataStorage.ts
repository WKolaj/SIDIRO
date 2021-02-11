export abstract class DataStorage<T> {
  constructor() {}

  public abstract dataExists(id: string): Promise<boolean>;
  public abstract getData(id: string): Promise<T | null>;
  public abstract setData(id: string, data: T): Promise<void>;
  public abstract init(): Promise<void>;
}
