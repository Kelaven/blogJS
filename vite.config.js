import { defineConfig } from 'vite';
import { resolve } from "path"; // ! pour build le multipages

export default defineConfig({
    root: "src",
    build: {
        outDir: '../dist',
        rollupOptions: { // ! pour build le multipages
            input: {
                main: resolve(__dirname, 'src/index.html'),
                form: resolve(__dirname, 'src/form/form.html'),
            }
        }
    },
});