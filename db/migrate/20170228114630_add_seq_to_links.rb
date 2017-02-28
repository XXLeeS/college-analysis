class AddSeqToLinks < ActiveRecord::Migration
  def change
  	rename_column :links, :source, :source_depno
  	rename_column :links, :target, :target_depno

  	add_column :links, :source, :integer
  	add_column :links, :target, :integer
  end
end
