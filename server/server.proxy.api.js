import fs from 'fs';
import request from 'request';
import bodyParser from 'body-parser';
import multiparty from 'multiparty';

function getErrCode (body) {
  try {
    body = typeof body !== 'object' ? JSON.parse(body) : body;
    if (body.error && body.error.code) {
      return body.error.code;
    } else {
      return 400;
    }
  } catch (e) {
    return 400;
  }
}

export default function (app, apiConfig) {

  app.use(bodyParser());

  app.all('/api/*', function (req, res) {

    var api = apiConfig.defaults,
        url = `${api.protocol}://${api.host}:${api.port}` + req.originalUrl,
        method = req.method,

        callback = function (error, response, body) {
          let status = response.statusCode;
          if (!error && status >= 200 && status <= 299) {
            res.status(status).send(body);
          } else {
            res.status(getErrCode(body)).send(body);
          }
        };

    if (method === 'GET') {

      request({
        url,
        method: 'GET'
      }, callback);

    } else if (method === 'POST' || method === 'PATCH' || method === 'DELETE') {

      let isMultiform = ((req.headers['content-type'] || '').indexOf('multipart/form-data') > -1);

      if (isMultiform) {

        let clientForm = new multiparty.Form();

        clientForm.parse(req, function (err, fields, files) {

          if (err) {

            callback(err);

          } else {

            let form = {};

            // Copy fields.
            for (let key in fields) {
              if (fields.hasOwnProperty(key)) {

                form[key] = fields[key][0]; // TODO : here may be a bug with multiple values (array of them).

              }
            }

            // Copy files.
            for (let key in files) {
              if (files.hasOwnProperty(key)) {

                let file = files[key][0]; // TODO : here will be a bug with multiple files under one field name.

                form[file.fieldName] = {
                  value: fs.createReadStream(file.path),
                  options: {
                    filename: file.originalFilename
                  }
                };

              }
            }

            request({
              url,
              method,
              formData: form
            }, callback);

          }

        });

      } else {

        request({
          url,
          method,
          body: req.body,
          json: true
        }, callback);

      }

    }

  });
}
