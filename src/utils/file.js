import JSZip from "jszip";
import { saveAs } from "file-saver";

export const zipFiles = async (files) => {
    const zip = new JSZip();
    files.forEach(({ name, content }) => {
        zip.file(name, content);
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "archive.zip");
    };