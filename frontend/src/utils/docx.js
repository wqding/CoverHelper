import { saveAs } from 'file-saver';
import { Document, Paragraph, Packer, TextRun } from 'docx';

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