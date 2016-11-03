class Dep105 < ActiveRecord::Base
	self.table_name = "dep_105"
	self.primary_key = "dep_no"

	def short_name
		self.name.sub(College.find(self.college_no).name, "")
	end

	has_many :winrate105s
end
