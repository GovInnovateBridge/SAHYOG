const fs = require('fs');
let content = fs.readFileSync('Backend/src/controllers/authController.js', 'utf8');

const target = es.status(200).json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profile: profile
    });;

const replacement = es.status(200).json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profile: profile,
        hasCompletedTrl: req.user.hasCompletedTrl,
        verifiedTrlScore: req.user.verifiedTrlScore
    });;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('Backend/src/controllers/authController.js', content, 'utf8');
    console.log('Successfully replaced');
} else {
    // Maybe line endings are CRLF
    const normalizedContent = content.replace(/\r\n/g, '\n');
    if (normalizedContent.includes(target)) {
        content = normalizedContent.replace(target, replacement);
        fs.writeFileSync('Backend/src/controllers/authController.js', content, 'utf8');
        console.log('Successfully replaced (normalized)');
    } else {
        console.log('Target not found in file');
    }
}
