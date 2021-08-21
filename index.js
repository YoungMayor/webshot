import DomToImage from "dom-to-image";

/**
 * Screenshot the content of an HTML element 
 * 
 * @param {string} elemID The ID of the element to convert to image
 * 
 * @returns Promise()
 */
async function __getImage(elemID) {
    const node = document.getElementById(elemID);

    return await DomToImage
        .toJpeg(node)
        .catch((err) => {
            console.trace(err);
            return false;
        })
        .finally(() => {
            //
        });
}

/**
 * Download the contents of an HTML element with ID (elemID) as an 
 * 
 * @param {string} elemID The ID of the element to convert to an image
 * @param {string} fileName The name to save the downloaded file as
 * 
 * @returns Promise()
 */
export async function download(elemID, fileName = "screenshot.jpg") {
    return __getImage(elemID).then((imageUrl) => {
        let link = document.createElement("a");
        link.href = imageUrl;
        link.download = fileName;
        link.click();
    });
}

/**
 * Share the contents of an HTML element as an Image on supported devices
 * 
 * @param {string} elemID The ID of the element to convert to an image
 * @param {string} fileName The name to save the downloaded file as
 * @param {Object} payload The extra share data
 * 
 * @returns Promise()
 */
export async function share(elemID, fileName = "screenshot.jpg", payload = {}) {
    return __getImage(elemID).then(async(imageUrl) => {
        const filesArray = [];

        try {
            const imgFetch = await fetch(imageUrl);

            const imgBlob = await imgFetch.blob();

            const file = new File(
                [imgBlob],
                fileName,
                imgBlob
            );
            filesArray.push(file);

            if (!navigator.canShare ||
                !navigator.canShare({ files: filesArray })
            ) {
                console.trace(
                    `Your machine doesn't support sharing files.`
                );
                return;
            }

            await navigator.share({
                files: filesArray,
                ...payload
            });
        } catch (err) {
            console.trace(err.message);
        }
    });
}

/**
 * Default Export
 * 
 * Methods 
 *  download(elemID, fileName)
 *  share(elemID, fileName, data)
 */
export default {
    download,
    share
}