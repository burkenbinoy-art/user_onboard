const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Render Deployment Preparation Check');
console.log('======================================');

// Colors for output (limited support in Windows)
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const NC = '\x1b[0m';

function checkFile(filePath, description) {
    try {
        if (fs.existsSync(filePath)) {
            console.log(`${GREEN}✅${NC} ${description}`);
            return true;
        } else {
            console.log(`${RED}❌${NC} ${description} - File missing`);
            return false;
        }
    } catch (err) {
        console.log(`${RED}❌${NC} ${description} - Error checking file`);
        return false;
    }
}

function checkEnvVar(filePath, varName) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(varName)) {
            console.log(`${GREEN}✅${NC} ${varName} documented in ${filePath}`);
            return true;
        } else {
            console.log(`${RED}❌${NC} ${varName} not found in ${filePath}`);
            return false;
        }
    } catch (err) {
        console.log(`${RED}❌${NC} Error reading ${filePath}`);
        return false;
    }
}

function checkScript(packagePath, scriptName) {
    try {
        const content = fs.readFileSync(packagePath, 'utf8');
        const packageJson = JSON.parse(content);
        if (packageJson.scripts && packageJson.scripts[scriptName]) {
            console.log(`${GREEN}✅${NC} ${scriptName} script configured`);
            return true;
        } else {
            console.log(`${RED}❌${NC} ${scriptName} script missing`);
            return false;
        }
    } catch (err) {
        console.log(`${RED}❌${NC} Error reading ${packagePath}`);
        return false;
    }
}

function checkDirectory(dirPath, description) {
    try {
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            console.log(`${GREEN}✅${NC} ${description}`);
            return true;
        } else {
            console.log(`${YELLOW}⚠️${NC} ${description} - Directory not found`);
            return false;
        }
    } catch (err) {
        console.log(`${RED}❌${NC} Error checking ${description}`);
        return false;
    }
}

function checkGitStatus() {
    try {
        // Check if it's a git repository
        execSync('git rev-parse --git-dir', { stdio: 'pipe' });
        console.log(`${GREEN}✅${NC} Git repository initialized`);

        // Check for uncommitted changes
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim() === '') {
            console.log(`${GREEN}✅${NC} All changes committed`);
        } else {
            console.log(`${YELLOW}⚠️${NC} Uncommitted changes detected`);
            console.log('   Run: git add . && git commit -m "Prepare for deployment"');
        }

        // Check for remote origin
        try {
            execSync('git remote get-url origin', { stdio: 'pipe' });
            console.log(`${GREEN}✅${NC} GitHub remote configured`);
        } catch (err) {
            console.log(`${RED}❌${NC} GitHub remote not configured`);
            console.log('   Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git');
        }

        return true;
    } catch (err) {
        console.log(`${RED}❌${NC} Not a git repository`);
        console.log('   Run: git init');
        return false;
    }
}

// Run checks
console.log('\n📁 Checking required files...');
const filesOk = [
    checkFile('render.yaml', 'render.yaml exists'),
    checkFile('package.json', 'package.json exists'),
    checkFile('client/package.json', 'client/package.json exists'),
    checkFile('server/package.json', 'server/package.json exists'),
    checkFile('.env.example', '.env.example exists')
];

console.log('\n🔧 Checking environment configuration...');
const envOk = checkEnvVar('.env.example', 'MONGO_URI');

console.log('\n🏗️ Checking build configuration...');
const buildOk = checkScript('package.json', 'render-postbuild');

console.log('\n⚛️ Checking React build...');
const clientDepsOk = checkDirectory('client/node_modules', 'Client dependencies installed');

console.log('\n🖥️ Checking server configuration...');
const serverDepsOk = checkDirectory('server/node_modules', 'Server dependencies installed');

console.log('\n📚 Checking git status...');
const gitOk = checkGitStatus();

// Summary
console.log('\n📋 Summary');
console.log('==========');
console.log('📖 Read the deployment guide: RENDER_DEPLOYMENT_GUIDE.md');
console.log('✅ Use the checklist: RENDER_DEPLOYMENT_CHECKLIST.md');
console.log('🔗 Render Dashboard: https://dashboard.render.com');
console.log('🗄️ MongoDB Atlas: https://cloud.mongodb.com');
console.log('');
console.log('🚀 Ready to deploy? Run: git push origin main');
console.log('   Then connect your GitHub repo to Render!');

// Exit with appropriate code
const allOk = filesOk.every(Boolean) && envOk && buildOk && gitOk;
process.exit(allOk ? 0 : 1);