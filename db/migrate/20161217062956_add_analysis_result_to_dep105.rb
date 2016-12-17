class AddAnalysisResultToDep105 < ActiveRecord::Migration
  def change
  	add_column :dep_105, :level, :integer

  	add_column :dep_105, :ts_rscore, :decimal
  	add_column :dep_105, :ts_mu, :decimal
  	add_column :dep_105, :ts_sigma, :decimal

  	add_column :dep_105, :max_num, :integer
  	add_column :dep_105, :waiting_num, :integer
  	add_column :dep_105, :real_num, :integer
  	add_column :dep_105, :predict_num, :numeric
  end
end
