class AddNewColumnToDep105 < ActiveRecord::Migration
  def change
  	add_column :dep_105, :lowest, :integer
  	add_column :dep_105, :field, :integer
  	add_column :dep_105, :college_no, :string
  end
end
