export interface TestInterface<T> {
    name: string;
    expectedResult: T | Error;
}