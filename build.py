import os
import os.path
import pdb
import time
import sys
import zipfile

def build_nw(project_directory, project_name):
	os.chdir(project_directory)
	with zipfile.ZipFile(project_name + '.zip', 'w') as myzip:
		zip_all(myzip, file_list(project_directory))

	# rename to *.nw
	rename_to_nw(project_directory, project_name)

def rename_to_nw(directory, name):
	if os.path.isfile(directory  + '/' + name + '.nw'):
		os.rename(directory + '/' + name + '.nw', directory + '/' + name + str(time.time()) + '.nw')
	os.rename(directory + '/' + name + '.zip', directory + '/' + name + '.nw')

def file_list(directory):
	return(f for f in os.listdir(directory)
		if os.path.isfile(os.path.join(directory, f)) and
		(".nw" not in f))

def zip_all(zip_f, f_list):
	try:
		while(f_list):
			zip_f.write(f_list.next())
	except StopIteration:
		return zip_f
	except:
		print "Error occured in zip_all()"

def test_build_script():
	pdb.set_trace()

	path_to_project_directory = "G:/projects/native_js_projects/invaders"
	cwd = os.getcwd()

	# wtf, there is a <type 'generator'> but type() can't find it? W/E, work around it!
	assert type(file_list("G:/")) is type(i for i in "generator"), file_list("G:/")
	# try:
	# 	x = file_list(path_to_project_directory)
	# 	while x:
	# 		print x.next()
	# except StopIteration:
	# 	pass
	# except Exception as e:
	# 	print e + " , file_list()"

	# need to change the cwd to the directory path for this to work? Yes you do.
	with zipfile.ZipFile('test.zip', 'a') as myzip:
		os.chdir(path_to_project_directory)
		output = zip_all(myzip, file_list(os.getcwd()))
		assert type(output) is zipfile.ZipFile

	os.chdir(cwd)
	try:
		os.remove("test.zip")
		os.remove("test.nw")
	except WindowsError:
		pass

def test_relative_paths(directory, name):
	directory = os.path.realpath(directory)
	build_nw(directory, name)


if __name__ == "__main__":
	if len(sys.argv) > 1:
		_, directory, name = sys.argv
		directory = os.path.realpath(directory)
		build_nw(directory, name)
		sys.exit()
	else:
		print """
	Usage: build.py path_to_project_directory project_name

	renames the old .nw archive, and creates a new one.
	"""
		test_build_script()