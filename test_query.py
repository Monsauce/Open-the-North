import pandas
import sqlite3
import json

length=40;
waterbody=44277609; # Ganonoque lake;
species=317;#Largemouth Bass;

conn = sqlite3.connect('../example.db')
query = 'SELECT ADV_LEVEL FROM fishes WHERE LENGTH_CATEGORY_ID=' + str(length) + ' AND WATERBODY_CODE=' + str(waterbody)+ ' AND SPECIES_CODE=' + str(species)+';'
print query

cursor = conn.cursor()
cursor.execute(query)
print(cursor.fetchall()[0][0])
SELECT ADV_LEVEL FROM fishes WHERE LENGTH_CATEGORY_ID=40 AND WATERBODY_CODE=44277609 AND SPECIES_CODE=317;
