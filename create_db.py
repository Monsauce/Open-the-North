import pandas
import sqlite3

def print_cols(df):
	for x in df.columns:
		print x


def create_query():
	return ''

# Example query:
# ''' CREATE TABLE stocks (date text, symbol text, price real);
#     INSERT INTO stock VALUES () '''

def create_db(df):
	conn = sqlite3.connect('example_small.db')
	conn.text_factory = str;
	c = conn.cursor()

	#query = create_query()
	#c.execute(query)
	#conn.commit() # may need to uncomment
	#df = df["WATERBODY_CODE","GUIDE_LOCNAME_ENG","SPECIES_CODE","SPECNAME","POPULATION_TYPE_ID","LENGTH_CATEGORY_ID","ADV_LEVEL","LAT_WGS84","LONG_WGS84"]
	df = df.iloc[:,[0,1,3,4,6,8,10,13,14]]
	print df.columns
	df = df.iloc[0:100]
	df.to_sql("fishes", conn, if_exists="replace")

	conn.close()


def main():
	print("???")
	df = pandas.read_csv("FishGuideRawData.csv")
	print_cols(df)
	create_db(df)

main()
