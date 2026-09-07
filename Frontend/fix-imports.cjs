const fs = require('fs');

const path = require('path');

const dir = path.join(__dirname, 'src');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk(dir, function(err, results) {
  if (err) throw err;
  results.forEach(file => {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;

      // Fix verbatimModuleSyntax imports
      const typesToFix = ['Match', 'Escrow', 'Milestone', 'MilestoneStatus', 'Challenge', 'User'];
      typesToFix.forEach(type => {
        const regex = new RegExp(`import\\s+\\{\\s*${type}\\s*\\}\\s+from`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, `import type { ${type} } from`);
          changed = true;
        }
      });
      // Also fix multiple imports like import { Escrow, Milestone }
      const regexMultiple = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
      content = content.replace(regexMultiple, (match, p1, p2) => {
        const imports = p1.split(',').map(i => i.trim());
        const hasTypes = imports.some(i => typesToFix.includes(i));
        if (hasTypes && imports.every(i => typesToFix.includes(i))) {
            return `import type { ${p1} } from '${p2}'`;
        }
        return match;
      });

      // Remove unused React imports
      if (content.match(/import\s+React\s+from\s+['"]react['"];?/)) {
        content = content.replace(/import\s+React\s+from\s+['"]react['"];?\n?/g, '');
        changed = true;
      }
      
      // Fix useEffect if unused - tricky with regex, we can just remove React import entirely first
      // Actually, standardizing Match type will fix most of the other issues.

      if (changed || content !== fs.readFileSync(file, 'utf8')) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
      }
    }
  });
});
