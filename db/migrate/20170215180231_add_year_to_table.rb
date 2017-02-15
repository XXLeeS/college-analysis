class AddYearToTable < ActiveRecord::Migration
  def change
  	add_column :dep_105, :year, :integer
  	add_column :link_105, :year, :integer
  	add_column :winrate_105, :year, :integer

  	remove_index :dep_105, :dep_no
  	add_index :dep_105, [:dep_no, :year], unique: true

  	rename_table :dep_105, :deps
  	rename_table :link_105, :links
  	rename_table :winrate_105, :winrates
  end
end
