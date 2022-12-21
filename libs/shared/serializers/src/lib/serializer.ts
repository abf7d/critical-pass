export interface Serializer<T> {
    fromJson(json: any): T;
    toJson(resource: T): any;
}
