export interface ICloudflareResponse {
    success: boolean,
    errors: Array<any>,
    messages: Array<any>,
    result: Array<any>,
    result_info?: { page: number, per_page: number, total_pages: number, count: number, total_count: number };
}
