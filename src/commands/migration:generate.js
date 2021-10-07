const { knex } = require('knex')

module.exports = {
  name: 'migration:generate',
  alias: ['g'],
  run: async toolbox => {
    const {
      parameters,
      template,
      print: { success, error },
      filesystem
    } = toolbox

    const name = parameters.first

    if (!name) {
      error('Path name must be specified')
      return
    }

    const { production } = await filesystem.read(
      'simpleorm.config.json',
      'json'
    )

    const connection = knex(production)
    const timestamps = new Date().getTime()
    const filename = `${timestamps}-${name}.js`

    await connection.schema.createTableIfNotExists(
      'simpleorm_migrations',
      table => {
        table.increments()
        table.string('migration')
        table.timestamp('generated_at').defaultTo(connection.fn.now())
      }
    )

    await connection('simpleorm_migrations').insert({ migration: filename })

    await template.generate({
      template: 'model.js.ejs',
      target: `${production.migrations}/database/migrations/${timestamps}-${name}.js`
    })

    return success(`You migration ${name} created! 📦`)
  }
}
