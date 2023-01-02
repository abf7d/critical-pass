export abstract class FileManagerBaseService<T> {
  constructor() { }
  abstract export(content: T): void;
  abstract import(file: File): Promise<T>;
 
}


