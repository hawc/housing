import busboy from 'busboy';
import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  }
}
const parseForm = async (req) => {
  return new Promise((resolve, reject) => {
    const form = busboy({ headers: req.headers });
    const files = [] // create an empty array to hold the processed files
    const buffers = {} // create an empty object to contain the buffers
    form.on('file', (field, file, filename, enc, mime) => {
      console.log(file)
      buffers[field] = [] // add a new key to the buffers object
      file.on('data', data => {
        buffers[field].push(data)
      })
      file.on('end', () => {
        files.push({
          fileBuffer: Buffer.concat(buffers[field]),
          fileType: mime,
          fileName: filename,
          fileEnc: enc,
        })
      })
    })
    form.on('error', err => {
      reject(err)
    })
    form.on('finish', () => {
      resolve(files)
    })
    req.pipe(form) // pipe the request to the form handler
  })
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      await console.log(files.file);
      return res.status(201).send('');
    });
    // const formDataEntryValues = Array.from(formData.values());
    // for (const formDataEntryValue of formDataEntryValues) {
    //   if (typeof formDataEntryValue === 'object' && formDataEntryValue && 'arrayBuffer' in formDataEntryValue) {
    //     const file = formDataEntryValue as unknown as Blob;
    //     const buffer = Buffer.from(await file.arrayBuffer());
    //     console.log(buffer)
    //     // fs.writeFileSync(`public/${file.name}`, buffer);
    //   }
    // }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false });
  }
}