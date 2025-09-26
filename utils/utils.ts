import { redirect } from "next/navigation";
import moment from "moment";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 *
 * @param osmData - open streetmap api data from https://nominatim.openstreetmap.org/reverse?format=json&lat=64.10589550758499&lon=-21.817974854458868
 */
export function getLocationNameStr(osmData: any) {
    if (!osmData || typeof osmData !== "object") {
        return "Eitthvað fór úrskeiðis";
    }

    const {
        road,            // Street name
        house_number,    // House number (if available)
        suburb,          // Neighborhood / district
        city,            // City
        town,            // Town (alternative to city)
        village,         // Village (alternative to city/town)
        county,          // County / region
        state,           // State / province
        country,         // Country
    } = osmData.address || {};

    const street = road ? `${road}${house_number ? ` ${house_number}` : ""}` : "";
    const locality = city || town || village || suburb || "";
    const region = county || state || "";

    const locationParts = [street, locality, region, country].filter(Boolean);

    return locationParts.length ? locationParts.join(", ") : "Ónákvæm mæling";
}