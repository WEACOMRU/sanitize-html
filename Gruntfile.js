/**
 * Created by bashkos on 02.06.15.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> | © <%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.author %> | <%= pkg.homepage %> */\n',
                sourceMap: true
            },
            build: {
                src: '<%= pkg.name %>.js',
                dest: '<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);
};
