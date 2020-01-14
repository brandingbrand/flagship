require "optionparser"
require "xcodeproj"

options = {}
file_refs = []

OptionParser.new do |opts|
  opts.on("-n", "-name NAME", String, "Project Name") do |name|
    options[:project_name] = name
  end
  opts.on("-p", "-project PATH", String, "Project Path") do |path|
    options[:project_path] = path
  end
  opts.on("-f", "-files FILES", Array, "Files to add to xcodeproject") do |files|
    options[:files] = files
  end
end.parse!

project_file = options[:project_path] + '.xcodeproj'
files = options[:files]

project = Xcodeproj::Project.open(project_file)
main_target = project.targets.first

files.each do |file|
  ref = project.new_file(file)
  file_refs << ref
end

main_target.add_resources(file_refs)
project.save(project_file)

