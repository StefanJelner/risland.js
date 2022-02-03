import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';
import babel from "@rollup/plugin-babel";
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import node from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const banner = `
/**
 * @license
 * author: ${pkg.author}
 * ${pkg.name} v${pkg.version}
 * Released under the ${pkg.license} license.
 * 
 * See ${pkg.repository.url}
 */
`;

const extensions = ['.js', '.ts'];

export default {
    input: './src/risland.ts'
    , output: [
        // IIFE
        {
            banner
            , file: pkg.browser
            , format: 'iife'
            , name: 'RIsland'
        }
        // IIFE minified
        , {
            banner
            , file: pkg.browser.replace('.js', '.min.js')
            , format: 'iife'
            , name: 'RIsland'
            , plugins: [terser()]
        }
        // ES
        , {
            banner
            , file: pkg.module
            , format: 'es'
        }
        // UMD
        , {
            banner
            , file: pkg.main
            , format: 'umd'
            , name: 'RIsland'
        }
    ]
    , plugins: [
        progress()
        , typescript()
        , node({
            browser: true
            , extensions
        })
        , commonjs({ extensions })
        , babel({
            babelHelpers: 'bundled'
            , extensions
            , presets: ['@babel/preset-env']
        })
        , filesize({
            showBrotliSize: false
            , showGzippedSize: false
            , showMinifiedSize: false
        })
    ]
};
