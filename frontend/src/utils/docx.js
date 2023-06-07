import { saveAs } from 'file-saver';
import { Document, Paragraph, Packer, TextRun } from 'docx';

import PizZip from 'pizzip';
import { DOMParser } from '@xmldom/xmldom';


export const downloadDocx = (data, contentType) => {
    const paragraphs = data.split("\n").map(paragraph => {
        return new Paragraph({
            children: [
                new TextRun({
                    text: paragraph.trim(),
                    size: 24, // the font size is half points so 24 = 12
                }),
            ],
            spacing: {
                line: 360, // Set line spacing to 1.5
            },
        });
    });

    // Create a new document
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: paragraphs,
            },
        ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${contentType}.docx`);
    });
}

function str2xml(str) {
    if (str.charCodeAt(0) === 65279) {
        // BOM sequence
        str = str.substr(1);
    }
    return new DOMParser().parseFromString(str, "text/xml");
}

// Get paragraphs as javascript array
function getParagraphs(content) {
    const zip = new PizZip(content);
    const xml = str2xml(zip.files["word/document.xml"].asText());
    const paragraphsXml = xml.getElementsByTagName("w:p");
    const paragraphs = [];
  
    for (let i = 0, len = paragraphsXml.length; i < len; i += 1) {
      let fullText = "";
      const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
      for (let j = 0, len2 = textsXml.length; j < len2; j += 1) {
        const textXml = textsXml[j];
        if (textXml.childNodes) {
          fullText += textXml.childNodes[0].nodeValue;
        }
      }
      if (fullText) {
        paragraphs.push(fullText);
      }
    }
    return paragraphs;
}

export const docxToText = (data, callbackAllDone) => {
    console.assert(data instanceof ArrayBuffer || typeof data === 'string');
    const paragraphs = getParagraphs(data)
    callbackAllDone(paragraphs.join(' '))
}
