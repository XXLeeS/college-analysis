class Dep105 < ActiveRecord::Base
	self.table_name = "dep_105"
	self.primary_key = "dep_no"

	has_many :winrate105s
end
