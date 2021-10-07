const { knex } = require('knex')
const shell = require('shelljs')

module.exports = {
  name: 'migration:up',
  alias: ['u'],
  run: async toolbox => {
    const {
      print: { success, error },
      filesystem
    } = toolbox

    const { production } = await filesystem.read(
      'simpleorm.config.json',
      'json'
    )
    const connection = knex(production)
    const row = await connection.raw(
      'select migration from simpleorm_migrations order by generated_at desc limit 1'
    )

    const file = row[0][0].migration

    const run = `node -e 'require("${production.migrations}migrations/${file}").down()' `

    shell.exec(run)

    success('Table is deleted! 😃')
  }
}
