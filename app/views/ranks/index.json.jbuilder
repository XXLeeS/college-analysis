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
	q1 = field.percentile(25)
	q3 = field.percentile(75)
	iqr = q3 - q1
	outlier = field.select{|score| score > (q3 + 1.5*iqr) || score < (q1 - 1.5*iqr)}
	remove_outlier = field.select{|score| score < (q3 + 1.5*iqr) && score > (q1 - 1.5*iqr)}

	temp = {
		:field => i,
		:min => remove_outlier.min.to_f,
		:max => remove_outlier.max.to_f,
		:median => field.median,
		:q1 => q1,
		:q3 => q3,
		:number => field.number,
		:outlier => outlier
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
	json.outlier field[:outlier]
end