import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const PORT = 3000;

async function killProcessOnPort(port) {
  try {
    console.log(`🔍 Checking for processes on port ${port}...`);

    // Find the process using the port
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);

    if (!stdout.trim()) {
      console.log(`✅ Port ${port} is free`);
      return;
    }

    // Extract PIDs from netstat output
    const lines = stdout.split('\n').filter(line => line.includes('LISTENING'));
    const pids = new Set();

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== '0') {
        pids.add(pid);
      }
    }

    if (pids.size === 0) {
      console.log(`✅ Port ${port} is free`);
      return;
    }

    // Kill each process
    for (const pid of pids) {
      try {
        console.log(`🔪 Killing process ${pid} on port ${port}...`);
        await execAsync(`taskkill /F /PID ${pid}`);
        console.log(`✅ Killed process ${pid}`);
      } catch (err) {
        console.log(`⚠️  Could not kill process ${pid}: ${err.message}`);
      }
    }

    // Wait a moment for the port to be released
    await new Promise(resolve => setTimeout(resolve, 1000));

  } catch (error) {
    // If netstat finds nothing, the port is free
    if (error.message.includes('The system cannot find')) {
      console.log(`✅ Port ${port} is free`);
    } else {
      console.log(`⚠️  Error checking port: ${error.message}`);
    }
  }
}

async function startDevServer() {
  await killProcessOnPort(PORT);

  console.log('🚀 Starting dev server...\n');

  // Start the dev server
  exec('npm run dev', (error, stdout, stderr) => {
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    if (error) console.error(`Error: ${error.message}`);
  });
}

startDevServer();
