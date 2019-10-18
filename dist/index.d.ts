import { AxiosRequestConfig } from "axios";
export { AxiosRequestConfig };
export declare type ServiceResult<T> = {
    success: true;
    payload: T;
} | {
    success: false;
    errMsg: string;
};
export declare type ServiceCallResult<T> = Promise<ServiceResult<T>>;
export interface ServiceCaller {
    get<T>(url: string): ServiceCallResult<T>;
    delete(url: string): ServiceCallResult<void>;
    post<T>(url: string, data?: any): ServiceCallResult<T>;
    put<T>(url: string, data?: any): ServiceCallResult<T>;
}
export declare const toServiceResult: <T>(success: boolean, x: string | T) => ServiceResult<T>;
export declare const transServiceResult: <T, U>(trans: (x: T) => U) => (result: ServiceResult<T>) => ServiceResult<U>;
export declare const successOrDefaultServiceResult: <T>(result: ServiceResult<T>, defaultValue: T) => T;
export declare const successOrUndefinedServiceResult: <T>(result: ServiceResult<T>) => T | undefined;
export declare const createServiceCaller: (apiRoot: string, config?: AxiosRequestConfig | undefined) => ServiceCaller;
