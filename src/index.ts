import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
export { AxiosRequestConfig };

export type ServiceResult<T> =
    | { success: true; payload: T }
    | { success: false; errMsg: string }
    ;

export type ServiceCallResult<T> = Promise<ServiceResult<T>>;

export interface ServiceCaller {
    get<T>(url: string): ServiceCallResult<T>;
    delete(url: string): ServiceCallResult<void>;
    post<T>(url: string, data?: any): ServiceCallResult<T>;
    put<T>(url: string, data?: any): ServiceCallResult<T>;
}

export const toServiceResult = <T>(success: boolean, x: T | string): ServiceResult<T> => {
    if (success) {
        return { success: true, payload: (x as T) };
    } else {
        return { success: false, errMsg: `${x}` };
    }
};

export const transServiceResult = <T, U>(trans: (x: T) => U) => (result: ServiceResult<T>): ServiceResult<U> =>
    !result.success
        ? toServiceResult<U>(false, result.errMsg)
        : toServiceResult<U>(true, trans(result.payload));

export const successOrDefaultServiceResult = <T>(result: ServiceResult<T>, defaultValue: T) =>
    result.success ? result.payload : defaultValue;

export const successOrUndefinedServiceResult = <T>(result: ServiceResult<T>) =>
    result.success ? result.payload : undefined;

const resultTrans = <T>(p: AxiosPromise<ServiceResult<T>>): ServiceCallResult<T> =>
    new Promise<ServiceResult<T>>(resolve =>
        p.then(x => resolve(x.data))
            .catch(e => resolve(toServiceResult<T>(false, `${e}`))));

class ServiceCallerImpl implements ServiceCaller {
    constructor(private apiRoot: string, private config?: AxiosRequestConfig) { }
    private apiUrl = (url: string) => `${this.apiRoot}/${url}`;
    get = <T>(url: string) => resultTrans(axios.get<ServiceResult<T>>(this.apiUrl(url), this.config));
    post = <T>(url: string, data?: any) => resultTrans(axios.post<ServiceResult<T>>(this.apiUrl(url), data, this.config));
    put = <T>(url: string, data?: any) => resultTrans(axios.put<ServiceResult<T>>(this.apiUrl(url), data, this.config));
    delete = (url: string) => resultTrans<void>(axios.delete(this.apiUrl(url), this.config));
}

export const createServiceCaller = (apiRoot: string, config?: AxiosRequestConfig): ServiceCaller =>
    new ServiceCallerImpl(apiRoot, config);
