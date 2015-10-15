"use strict";

var fs = require("fs");
var junk = require("junk");

module.exports = function(grunt)
{
	grunt.registerMultiTask("cleanempty", "Clean empty files and folders.", function()
	{
		// Task options
		var files   = !(grunt.option("files")    === false);	// defaults to true
		var folders = !(grunt.option("folders")  === false);	// defaults to true
		var force   =   grunt.option("force")    === true;
		var noWrite =   grunt.option("no-write") === true;
		var noJunk  =   grunt.option("junk")     === true;
		
		// Target options
		var options = this.options();
		var options = this.options(
		{
			files:      (options.files      ===undefined ? files   : options.files),
			folders:    (options.folders    ===undefined ? folders : options.folders),
			force:      (options.force      ===undefined ? force   : options.force),
			"no-write": (options["no-write"]===undefined ? noWrite : options["no-write"]),
			noJunk:     (options.noJunk     ===undefined ? noJunk  : options.noJunk)
		});
		
		grunt.verbose.writeflags(options, "Options");
		
		
		var deleteOptions = {force:options.force, "no-write":options["no-write"]};
		
		
		for (var i=this.filesSrc.length-1; i>=0; i--)
		{
			var filepath = this.filesSrc[i];
			
			
			if ( !grunt.file.isDir(filepath) )
			{
				if (!options.files || fs.readFileSync(filepath).length > 0) continue;
			}
			else
			{
				if (!options.folders) continue;
				
				var arr = fs.readdirSync(filepath);
				var len = arr.length;
				
				if (options.noJunk && len > 0)
				{
					var allJunk = arr.every(function(name) 
					{
						return grunt.file.isFile(filepath + '/' + name) && junk.is(name);
					});
					
					if (!allJunk) continue;
				}
				else if (len > 0)
				{
					continue;
				}
			}
			
			
			grunt.verbose.write((options["no-write"] ? "Not actually cleaning " : "Cleaning ") + filepath + "...");
			
			grunt.file.delete(filepath, deleteOptions);
			
			grunt.verbose.ok();
		}
		
		grunt.log.ok(this.filesSrc.length + " " + grunt.util.pluralize(this.filesSrc.length, "path/paths") + " cleaned.")
	});
};
