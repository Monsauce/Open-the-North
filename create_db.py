import pandas
import sqlite3
import json
from sqlalchemy import create_engine

def print_cols(df):
	for x in df.columns:
		print x
#print_cols(df)

def create_query():
	return ''

# Example query:
# ''' CREATE TABLE stocks (date text, symbol text, price real);
#     INSERT INTO stock VALUES () '''
import numpy as np

def generate_mappings(df):
	with open("waterbodies.js","w") as f:
		f.write("waterbodies = ")
		f.write(json.dumps(df[["WATERBODY_CODE","GUIDE_LOCNAME_ENG"]].iloc[np.unique(df["WATERBODY_CODE"].values, return_index=1)[1]].values.tolist()))

	with open("species.js","w") as f:
		f.write("species = "+json.dumps(df[["SPECIES_CODE","SPECNAME"]].iloc[np.unique(df["SPECIES_CODE"].values, return_index=1)[1]].values.tolist()))
		f.write(json.dumps(df[["SPECIES_CODE","SPECNAME"]].iloc[np.unique(df["SPECIES_CODE"].values, return_index=1)[1]].values.tolist()))

	return


def make_hack_txt(df,output_filename,col,max_rows=None):
	# gets all unique values in a column and dumps to outfile
		if max_rows:
			trunc_df = df[:max_rows]
		else:
			trunc_df = df
		with open(output_filename,"w") as f:
			#print np.unique(df["WATERBODY_CODE"].values, return_index=1)[1]
			vals = np.unique(trunc_df.iloc[0:][col].values)
			string = ""
			i = 0
			for item in vals:
				string += "<option value=\"" + item + "\">" +  item + "</option>\n"
				#string += "<option value=\"" + str(i) + "\">" +  item + "</option>\n"
				i+=1
			f.write(string)

def generate_mappings_bootstrap_hack(df):
			make_hack_txt(df,"waterbodies.txt","GUIDE_LOCNAME_ENG")
			make_hack_txt(df,"fish.txt","SPECNAME")
			make_hack_txt(df,"lengths.txt","LENGTH_CATEGORY_LABEL")
			#f.write(json.dumps(df[["WATERBODY_CODE",]].values.tolist()))


def try_it(df):
	with open("test.txt", "w") as f:
		for row in df.iterrows():
			#print row[1]
			f.write("[" + str(row[1]["WATERBODY_CODE"]) + "," + str(row[1]["SPECIES_CODE"]) + "," + str(1) + "]\n")


def create_postgres_db(df):
	df.columns = [c.lower() for c in df.columns] #postgres doesn't like capitals or spaces
	engine = create_engine('postgresql://username:password@localhost:5432/dbname')

	df.to_sql("my_table_name", engine)


def create_db(df):
	conn = sqlite3.connect('example_small.db')
	conn.text_factory = str;
	c = conn.cursor()

	#query = create_query()
	#c.execute(query)
	#conn.commit() # may need to uncomment

	### comment out these lines to avoid using the toy db
	df = df.iloc[:,[0,1,3,4,6,8,10,13,14]]
	print df.columns
	df = df.iloc[0:100]
	###

	df.to_sql("fishes", conn, if_exists="replace")

	conn.close()


def main():
	df = pandas.read_csv("FishGuideRawData.csv")
	#generate_mappings(df)
	print_cols(df)
	df = df[[""]]
	generate_mappings_bootstrap_hack(df)
	try_it(df)
	#create_db(df)

main()
