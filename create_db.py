import pandas
import sqlite3

def print_cols():
	for x in df.columns:
		print x


def create_query():
	return ''

# Example query:
# ''' CREATE TABLE stocks (date text, symbol text, price real);
#     INSERT INTO stock VALUES () ''' 

def create_db(df):
	conn = sqlite3.connect('example.db')
	c = conn.cursor()
	
	#query = create_query()
	#c.execute(query)
	#conn.commit() # may need to uncomment
	
	df.to_sql("fishes", conn, if_exists="replace")

	conn.close()


def main():
	df = pandas.read_csv("FishGuideRawData.csv")
	print_cols(df)
	create_db(df)
