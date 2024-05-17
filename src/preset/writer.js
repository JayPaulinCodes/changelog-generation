const compareFunc = require("compare-func");
const fileURLToPath = require("url").fileURLToPath;
const resolve = require("path").resolve;
const readFile = require("fs/promises").readFile;

const dirname = fileURLToPath(new URL('.', import.meta.url))

export async function createWriterOpts () {
  const [template, header, commit, footer] = await Promise.all([
    readFile(resolve(dirname, './templates/template.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/header.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/commit.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/footer.hbs'), 'utf-8')
  ])
  const writerOpts = getWriterOpts()

  writerOpts.mainTemplate = template
  writerOpts.headerPartial = header
  writerOpts.commitPartial = commit
  writerOpts.footerPartial = footer

  return writerOpts
}

function getWriterOpts () {
  return {
    transform: (commit, context) => {
      let discard = true
      const notes = commit.notes.map(note => {
        discard = false

        return {
          ...note,
          title: 'BREAKING CHANGES'
        }
      })

      let type = commit.type

      if (commit.type === 'feat') {
        type = 'Features'
      } else if (commit.type === 'fix') {
        type = 'Bug Fixes'
      } else if (commit.type === 'perf') {
        type = 'Performance Improvements'
      } else if (commit.type === 'revert' || commit.revert) {
        type = 'Reverts'
      } else if (commit.type === 'chore') {
        type = 'Misc'
      } else if (commit.type === 'auto') {
        type = 'Automated Commits'
      } else if (commit.type === 'docs') {
        type = 'Documentation'
      } else if (commit.type === 'refactor') {
        type = 'Code Refactoring'
      } else if (discard) {
        return
      } else if (commit.type === 'style') {
        type = 'Styles'
      } else if (commit.type === 'test') {
        type = 'Tests'
      } else if (commit.type === 'build') {
        type = 'Build System'
      } else if (commit.type === 'ci') {
        type = 'Continuous Integration'
      }

      const scope = commit.scope === '*' ? '' : commit.scope
      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, 7)
        : commit.shortHash

      const issues = []
      let subject = commit.subject

      if (typeof subject === 'string') {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl
        if (url) {
          url = `${url}/issues/`
          // Issue URLs.
          subject = subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue)
            return `[#${issue}](${url}${issue})`
          })
        }
        if (context.host) {
          // User URLs.
          subject = subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
            if (username.includes('/')) {
              return `@${username}`
            }

            return `[@${username}](${context.host}/${username})`
          })
        }
      }

      // remove references that already appear in the subject
      const references = commit.references.filter(reference => !issues.includes(reference.issue))

      return {
        notes,
        type,
        scope,
        shortHash,
        subject,
        references
      }
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}