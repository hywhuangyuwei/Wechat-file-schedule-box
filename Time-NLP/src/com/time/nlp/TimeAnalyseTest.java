package com.time.nlp;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.time.nlp.TimeNormalizer;
import com.time.util.DateUtil;

public class TimeAnalyseTest {
	public static void main(String args[]) {
		System.out.println(exec("进行训练"));

		/*
		 * String path = TimeNormalizer.class.getResource("").getPath(); String
		 * classPath = path.substring(0, path.indexOf("/com/time"));
		 * System.out.println(classPath); TimeNormalizer normalizer = new
		 * TimeNormalizer(classPath + "/TimeExp.m");
		 * 
		 * String timeString = "下周一下午三点开会"; normalizer.parse(timeString);// 抽取时间
		 * TimeUnit[] unit = normalizer.getTimeUnit();
		 * 
		 * System.out.println(timeString);
		 * System.out.println(DateUtil.formatDateDefault(unit[0].getTime()) + "-" +
		 * unit[0].getIsAllDayTime());
		 */

		/*
		 * normalizer.parse("早上六点起床");// 注意此处识别到6天在今天已经过去，自动识别为明早六点（未来倾向，可通过开关关闭：new //
		 * TimeNormalizer(classPath+"/TimeExp.m", false)） unit =
		 * normalizer.getTimeUnit(); System.out.println("早上六点起床");
		 * System.out.println(DateUtil.formatDateDefault(unit[0].getTime()) + "-" +
		 * unit[0].getIsAllDayTime()); normalizer.parse("周一开会");//
		 * 如果本周已经是周二，识别为下周周一。同理处理各级时间。（未来倾向） unit = normalizer.getTimeUnit();
		 * System.out.println("周一开会");
		 * System.out.println(DateUtil.formatDateDefault(unit[0].getTime()) + "-" +
		 * unit[0].getIsAllDayTime()); normalizer.parse("下下周一开会");// 对于上/下的识别 unit =
		 * normalizer.getTimeUnit(); System.out.println("下下周一开会");
		 * System.out.println(DateUtil.formatDateDefault(unit[0].getTime()) + "-" +
		 * unit[0].getIsAllDayTime()); normalizer.parse("6:30 起床");// 严格时间格式的识别 unit =
		 * normalizer.getTimeUnit(); System.out.println("6:30 起床");
		 * System.out.println(DateUtil.formatDateDefault(unit[0].getTime()) + "-" +
		 * unit[0].getIsAllDayTime()); normalizer.parse("6-3 春游");// 严格时间格式的识别 unit =
		 * normalizer.getTimeUnit(); System.out.println("6-3 春游");
		 * System.out.println(DateUtil.formatDateDefault(unit[0].getTime()) + "-" +
		 * unit[0].getIsAllDayTime()); normalizer.parse("6月3  春游");// 残缺时间的识别
		 * （打字输入时可便捷用户） unit = normalizer.getTimeUnit(); System.out.println("6月3  春游");
		 * System.out.println(DateUtil.formatDateDefault(unit[0].getTime()) + "-" +
		 * unit[0].getIsAllDayTime()); normalizer.parse("明天早上跑步");//
		 * 模糊时间范围识别（可在RangeTimeEnum中修改 unit = normalizer.getTimeUnit();
		 * System.out.println("明天早上跑步");
		 * System.out.println(DateUtil.formatDateDefault(unit[0].getTime()) + "-" +
		 * unit[0].getIsAllDayTime()); normalizer.parse("本周日到下周日出差");// 多时间识别 unit =
		 * normalizer.getTimeUnit(); System.out.println("本周日到下周日出差");
		 * System.out.println(DateUtil.formatDateDefault(unit[0].getTime()) + "-" +
		 * unit[0].getIsAllDayTime());
		 * System.out.println(DateUtil.formatDateDefault(unit[1].getTime()) + "-" +
		 * unit[1].getIsAllDayTime()); normalizer.parse("周四下午三点到五点开会");//
		 * 多时间识别，注意第二个时间点用了第一个时间的上文 unit = normalizer.getTimeUnit();
		 * System.out.println("周四下午三点到五点开会");
		 * System.out.println(DateUtil.formatDateDefault(unit[0].getTime()) + "-" +
		 * unit[0].getIsAllDayTime());
		 * System.out.println(DateUtil.formatDateDefault(unit[1].getTime()) + "-" +
		 * unit[1].getIsAllDayTime());
		 */
	}

	public static String exec(String timeString) {
		String path = TimeNormalizer.class.getResource("").getPath();
		String classPath = path.substring(0, path.indexOf("/com/time"));
		TimeNormalizer normalizer = new TimeNormalizer(classPath + "/TimeExp.m");

		normalizer.parse(timeString);// 抽取时间
		TimeUnit[] unit = normalizer.getTimeUnit();

		// 是否区间-开始时间-是否全天-结束时间-是否全天
		String resFormatter = "%d,%s,%d,%s,%d";

		if (unit.length == 0) {
			// 没有发现时间文本，则默认为今天
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd 00:00:00");
			String today = sdf.format(new Date());
			return String.format(resFormatter, 0, today, 1, today, 1);
		} else if (unit.length == 1) {
			// 只发现了一个时间文本
			String timeStr = DateUtil.formatDateDefault(unit[0].getTime());
			int is_allday = unit[0].getIsAllDayTime() == true ? 1 : 0;
			return String.format(resFormatter, 0, timeStr, is_allday, timeStr, is_allday);
		} else {
			// 发现了两个或者以上的时间文本，则以前两个为区间
			String timeStr1 = DateUtil.formatDateDefault(unit[0].getTime());
			String timeStr2 = DateUtil.formatDateDefault(unit[1].getTime());
			int is_allday1 = unit[0].getIsAllDayTime() == true ? 1 : 0;
			int is_allday2 = unit[1].getIsAllDayTime() == true ? 1 : 0;
			return String.format(resFormatter, 1, timeStr1, is_allday1, timeStr2, is_allday2);
		}
	}
}
