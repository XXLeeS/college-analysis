class College < ActiveRecord::Base
	self.table_name = "colleges"
	self.primary_key = "college_no"

	has_many :dep_105s
end
