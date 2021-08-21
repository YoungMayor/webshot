import DomToImage from "dom-to-image";

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

export async function save(elemID, fileName = "screenshot.jpg") {
    return __getImage(elemID).then((imageUrl) => {
        let link = document.createElement("a");
        link.href = imageUrl;
        link.download = fileName;
        link.click();
    });
}

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

export default {
    save,
    share
}