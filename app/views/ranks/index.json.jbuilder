# json.deps @departments do |d|
# 	json.dep_no d.dep_no
# 	json.field d.field
# 	json.rscore d.ts_rscore
# end

fields = @fields.keys

dep_by_field = @departments.group_by{|d| d.field}.sort_by{|key, value| key}
# puts dep_by_field[8][1][1].values
rscores = []
dep_by_field.each_with_index do |field, i| 
	rscores[i] = field[1].map{|d| d.ts_rscore}
end
rscores.unshift(@departments.map{|d| d.ts_rscore})


statistics = []
rscores.each_with_index do |field, i|
	field.extend(DescriptiveStatistics)
	temp = {
		:field => i,
		:min => field.min.to_f,
		:max => field.max.to_f,
		:median => field.median,
		:q1 => field.percentile(25),
		:q3 => field.percentile(75),
		:number => field.number
	}
	statistics.push(temp)
end

json.statistics statistics do |field|
	json.field field[:field]
	json.min field[:min]
	json.max field[:max]
	json.median field[:median]
	json.q1 field[:q1]
	json.q3 field[:q3]
	json.number field[:number]
end