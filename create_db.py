import pandas
import sqlite3
import json
def print_cols(df):
	for x in df.columns:
		print x
print_cols(df)

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
w	df[["ADV_LEVEL"]].iloc[np.unique(df["ADV_LEVEL"].values, return_index=1)[1]]

	df[["ADV_LEVEL"]].iloc[np.unique(df["ADV_LEVEL"].values, return_index=1)[1]].values
	df[["LENGTH_CATEGORY_ID","LENGTH_CATEGORY_LABEL"]].iloc[np.unique(df["LENGTH_CATEGORY_ID"].values, return_index=1)[1]].values
	with open("species.js","w") as f:
		f.write("species = "+json.dumps(df[["SPECIES_CODE","SPECNAME"]].iloc[np.unique(df["SPECIES_CODE"].values, return_index=1)[1]].values.tolist()))
	json.dumps(df[["SPECIES_CODE","SPECNAME"]].iloc[np.unique(df["SPECIES_CODE"].values, return_index=1)[1]].values.tolist())

	return

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
	generate_mappings(df)
	print_cols(df)
	create_db(df)

main()
