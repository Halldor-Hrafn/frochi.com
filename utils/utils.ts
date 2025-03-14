import {redirect} from "next/navigation";
import moment from "moment";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
    type: "error" | "success",
    path: string,
    message: string,
) {
    return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}


export function formatTime(date: Date) {
    const now = moment();
    const input = moment(date);

    if (input.isSame(now, 'day')) {
        return input.format('HH:mm:ss');
    } else if (input.isSame(now.clone().subtract(1, 'day'), 'day')) {
        return `Í gær ${input.format('HH:mm:ss')}`;
    } else {
        return input.format('YYYY-MM-DD HH:mm:ss');
    }
}