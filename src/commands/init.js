const { knex } = require('knex')

module.exports = {
  name: 'init',
  alias: ['i'],
  run: async toolbox => {
    const {
      parameters,
      template,
      print: { success, error },
      filesystem
    } = toolbox

    const json = await filesystem.read('simpleorm.config.json', 'json')

    await template.generate({
      template: 'database.js.ejs',
      target: `./database/index.js`
    })

    await template.generate({
      template: 'model.js.ejs',
      target: `./src/database/migrations/simpleorm-migration.js`
    })

    await template.generate({
      template: 'simpleorm.config.json.ejs',
      target: `./simpleorm.config.json`
    })
  }
}
