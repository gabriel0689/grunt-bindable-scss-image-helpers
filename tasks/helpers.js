'use strict';
var sizeOf = require('image-size'),
path = require('path'),
fs = require('fs'),
mime = require('mime');

module.exports = function (grunt) {
    grunt.registerMultiTask('scss_images', 'Create image size variables', function() {
        var options = this.options({
            prefix: 'grunt-images',
            imageRoot: '',
            imageRoot2: '',
            relativePath: '',
            relativePath2: '',
            antiCache: false,
            size: 10240
        });

        this.files.forEach(function(filePair) {
            var dest = filePair.dest,
            src = filePair.src,
            output = '',
            list = {
                ids: [],
                widths: [],
                heights: [],
                paths: [],
                base64: [],
                ids2: [],
                widths2: [],
                heights2: [],
                paths2: [],
                base642: []
            };

            src.forEach(function(file) {




                // console.log(file);
                // console.log(path.relative(options.imageRoot, file))




// console.log(fileString)
// // console.log("/"+file.toString().indexOf(options.relativePath));

// if(fileString.indexOf(options.relativePath) > -1){
// console.log("wee");
// }
// if(fileString.indexOf(options.relativePath2) > -1){
// console.log("oo");
// }
// return
                var fileString = "/"+file;

                if(fileString.indexOf(options.relativePath) > -1){

                    var filePath = unixifyPath(path.relative(options.imageRoot, file)),
                    size = null,
                    time = 0,
                    stats = null;
                    if (path.extname(file) === '.svg') { // waiting for image-size to implement svg support
                        size = {
                            width: 0,
                            height: 0
                        };
                    } else {
                        size = sizeOf(file);
                    }

                    list.ids.push(filePath);
                    list.paths.push(filePath);

                    list.widths.push(size.width);
                    list.heights.push(size.height);

                    stats = fs.statSync(file);


                    if (stats.size < options.size) {
                        list.base64.push('data:' + mime.lookup(file) + ';base64,' + fs.readFileSync(file, 'base64'));
                    } else {
                        list.base64.push('');
                    }
                    if (options.antiCache) {
                        time = (new Date(stats.mtime).getTime()/1000).toFixed(0);
                        filePath = filePath.replace(/([^\.]*)$/, time + '.$1');
                    }

                    // console.log(filePath);
                                
                }
                // if(fileString.indexOf(options.relativePath2) > -1){
                else{
                    var filePath2 = unixifyPath(path.relative(options.imageRoot2, file)),
                    size = null,
                    time = 0,
                    stats = null;
                    if (path.extname(file) === '.svg') { // waiting for image-size to implement svg support
                        size = {
                            width: 0,
                            height: 0
                        };
                    } else {
                        size = sizeOf(file);
                    }

                    list.ids2.push(filePath2);
                    list.paths2.push(filePath2);

                    list.widths2.push(size.width);
                    list.heights2.push(size.height);

                    stats = fs.statSync(file);


                    if (stats.size < options.size) {
                        list.base64.push('data:' + mime.lookup(file) + ';base64,' + fs.readFileSync(file, 'base64'));
                    } else {
                        list.base64.push('');
                    }

                    if (options.antiCache) {
                        time = (new Date(stats.mtime).getTime()/1000).toFixed(0);
                        filePath2 = filePath2.replace(/([^\.]*)$/, time + '.$1');
                    }
                    
                    
                    // console.log(filePath2);
                }




                // var filePath = unixifyPath(path.relative(options.imageRoot, file)),
                // size = null,
                // time = 0,
                // stats = null;

                // if (path.extname(file) === '.svg') { // waiting for image-size to implement svg support
                //     size = {
                //         width: 0,
                //         height: 0
                //     };
                // } else {
                //     size = sizeOf(file);
                // }



                // list.ids.push(filePath);
                // list.paths.push(filePath);

                // list.widths.push(size.width);
                // list.heights.push(size.height);

                // stats = fs.statSync(file);


                // if (stats.size < options.size) {
                //     list.base64.push('data:' + mime.lookup(file) + ';base64,' + fs.readFileSync(file, 'base64'));
                // } else {
                //     list.base64.push('');
                // }

                // if (options.antiCache) {
                //     time = (new Date(stats.mtime).getTime()/1000).toFixed(0);
                //     filePath = filePath.replace(/([^\.]*)$/, time + '.$1');
                // }


                
            });

            output += '$' + options.prefix + '-ids: ' +  '\'' + list.ids.join('\', \'') + '\';\n';
            output += '$' + options.prefix + '-ids2: ' +  '\'' + list.ids2.join('\', \'') + '\';\n';

            output += '$' + options.prefix + '-names: ' +  '\'' + list.paths.join('\', \'') + '\';\n';
            output += '$' + options.prefix + '-names2: ' +  '\'' + list.paths2.join('\', \'') + '\';\n';

            output += '$' + options.prefix + '-base64: ' +  '\'' + list.base64.join('\', \'') + '\';\n';
            output += '$' + options.prefix + '-base642: ' +  '\'' + list.base64.join('\', \'') + '\';\n';

            output += '$' + options.prefix + '-relative-path: \'' + options.relativePath + '\';\n';
            output += '$' + options.prefix + '-relative-path2: \'' + options.relativePath2 + '\';\n';

            if(list.widths != ''){
               output += '$' + options.prefix + '-widths: ' + list.widths.join(', ') + ';\n';  
               output += '$' + options.prefix + '-widths2: ' + list.widths2.join(', ') + ';\n';  
            }
            else{
            output += '$' + options.prefix + '-widths:'+' "" '+';\n';
            output += '$' + options.prefix + '-widths2:'+' "" '+';\n';
            console.log("empty list.widths");
            }
            if(list.heights != ''){
               output += '$' + options.prefix + '-heights: ' + list.heights.join(', ') + ';\n';
               output += '$' + options.prefix + '-heights2: ' + list.heights2.join(', ') + ';\n';
            }
            else{
               output += '$' + options.prefix + '-heights:'+' "" '+';\n';
               output += '$' + options.prefix + '-heights2:'+' "" '+';\n';
               console.log("empty list.heights");
            }
            // output += '@debug $' + options.prefix + '-names;',
            // output += '@debug $' + options.prefix + '-names2;',

            // this is temporary solution
            output += [
            "@function image-width($image) {",
                "$index: index($" + options.prefix + "-ids, $image);",
                "$index2: index($" + options.prefix + "-ids2, $image);",

                "@if $index {",
                    "@return nth($" + options.prefix + "-widths, $index)*1px;",
                "}",
                "@if $index2 {",
                    "@return nth($" + options.prefix + "-widths2, $index2)*1px;",
                "}",
            "}",

            "@function image-height($image) {",
                "$index: index($" + options.prefix + "-ids, $image);",
                "$index2: index($" + options.prefix + "-ids2, $image);",
                "@if $index {",
                    "@return nth($" + options.prefix + "-heights, $index)*1px;",
                "}",
                "@if $index2 {",
                    "@return nth($" + options.prefix + "-heights2, $index2)*1px;",
                "}",
            "}",

            "@function image-url($image) {",
                "$index: index($" + options.prefix + "-ids, $image);",
                "$index2: index($" + options.prefix + "-ids2, $image);",
                "@if $index {",
                        "$image-name: nth($grunt-images-names, $index);",
                            "@return url('#{$grunt-images-relative-path}#{$image-name}')",
                "}",

                "@if $index2 {",
                        "$image-name: nth($grunt-images-names2, $index2);",
                            "@return url('#{$grunt-images-relative-path2}#{$image-name}')",
                "}",

                "@else {",
                    "@return url('#{$" + options.prefix + "-relative-path}#{$image}');",
                "}",
            "}",

            "@function inline-image($image) {",
                "$index: index($" + options.prefix + "-ids, $image);",
                "$index2: index($" + options.prefix + "-ids2, $image);",
                "@if $index {",
                    "$base64: nth($" + options.prefix + "-base64, $index);",
                    "@if $base64 == '' {",
                        "$image-name: nth($" + options.prefix + "-names, $index);",
                        "@return url('#{$" + options.prefix + "-relative-path}#{$image-name}')",
                    "}",
                    "@else {",
                        "@return url('#{$base64}')",
                    "}",
                "}",
                "@if $index2 {",
                    "$base642: nth($" + options.prefix + "-base64, $index2);",
                    "@if $base642 == '' {",
                        "$image-name2: nth($" + options.prefix + "-names2, $index);",
                        "@return url('#{$" + options.prefix + "-relative-path}#{$image-name2}')",
                    "}",
                    "@else {",
                        "@return url('#{$base64}')",
                    "}",
                "}",
                "@else {",
                    "@return url('#{$" + options.prefix + "-relative-path}#{$image}'); ",
                "}",
            "}"
            ].join('\n');

            grunt.file.write(dest, output);

        });

});

var unixifyPath = function(filepath) {
    if (process.platform === 'win32') {
        return filepath.replace(/\\/g, '/');
    } else {
        return filepath;
    }
};
};
