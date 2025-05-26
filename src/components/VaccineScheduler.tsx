import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, Check, Save } from "lucide-react";
import { nonNipVaccines } from '@/lib/vaccineData';
import {
  generateVaccinationSchedule,
  generateReminders,
  groupScheduleByAgeStage,
  VaccinationDate
} from '@/lib/scheduleUtils';
import {
  saveVaccinationSchedule,
  generateWechatReminders,
  WechatReminder
} from '@/lib/storageUtils';

export default function VaccineScheduler() {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [babyName, setBabyName] = useState<string>("");
  const [vaccinationUnit, setVaccinationUnit] = useState<string>("某厂商接种点");
  const [selectedNonNipVaccines, setSelectedNonNipVaccines] = useState<string[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [enableReminders, setEnableReminders] = useState(true);
  const [vaccinationSchedule, setVaccinationSchedule] = useState<VaccinationDate[]>([]);
  const [groupedSchedule, setGroupedSchedule] = useState<Record<string, VaccinationDate[]>>({});
  const [reminders, setReminders] = useState<{ date: Date; message: string }[]>([]);
  const [wechatReminders, setWechatReminders] = useState<WechatReminder[]>([]);
  const [activeTab, setActiveTab] = useState("input");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showWechatReminder, setShowWechatReminder] = useState(false);

  // 处理非免疫规划疫苗选择变化
  const handleNonNipVaccineChange = (vaccineId: string, checked: boolean) => {
    if (checked) {
      setSelectedNonNipVaccines([...selectedNonNipVaccines, vaccineId]);
    } else {
      setSelectedNonNipVaccines(selectedNonNipVaccines.filter(id => id !== vaccineId));
    }
  };

  // 生成疫苗接种排期
  const generateSchedule = () => {
    if (birthDate) {
      const schedule = generateVaccinationSchedule(birthDate, selectedNonNipVaccines);
      setVaccinationSchedule(schedule);
      setGroupedSchedule(groupScheduleByAgeStage(schedule));

      if (enableReminders) {
        const reminderList = generateReminders(schedule);
        setReminders(reminderList);
        setWechatReminders(generateWechatReminders(reminderList));
      } else {
        setReminders([]);
        setWechatReminders([]);
      }

      setShowSchedule(true);
      setActiveTab("schedule");
    }
  };

  // 格式化日期显示
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // 保存接种排期
  const saveSchedule = () => {
    if (birthDate && babyName.trim()) {
      const success = saveVaccinationSchedule(
        babyName,
        birthDate,
        vaccinationUnit,
        vaccinationSchedule,
        reminders
      );

      if (success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } else {
      alert("请输入宝宝姓名后再保存");
    }
  };

  // 显示微信提醒模拟
  const toggleWechatReminder = () => {
    setShowWechatReminder(!showWechatReminder);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">儿童疫苗接种排期助手</h1>
          <p className="text-muted-foreground">基于国家免疫规划疫苗儿童免疫程序及说明（2021年版）</p>
        </header>

        {savedSuccess && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">保存成功</AlertTitle>
            <AlertDescription>
              接种排期已保存！我们会在接种日期前通过微信提醒您。
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">信息输入</TabsTrigger>
            <TabsTrigger value="schedule" disabled={!showSchedule}>接种排期</TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <Card>
              <CardHeader>
                <CardTitle>宝宝信息</CardTitle>
                <CardDescription>
                  请输入宝宝的基本信息，我们将为您生成个性化的疫苗接种排期
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="babyName">宝宝姓名</Label>
                  <Input
                    id="babyName"
                    placeholder="请输入宝宝姓名"
                    value={babyName}
                    onChange={(e) => setBabyName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">出生日期</Label>
                  <div className="border rounded-md p-4">
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      disabled={(date) => date > new Date()}
                      className="mx-auto"
                    />
                  </div>
                  {birthDate && (
                    <p className="text-sm text-muted-foreground">
                      已选择: {formatDate(birthDate)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaccinationUnit">接种单位</Label>
                  <Select value={vaccinationUnit} onValueChange={setVaccinationUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择接种单位" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="某厂商接种点">某厂商接种点</SelectItem>
                      <SelectItem value="社区卫生服务中心">社区卫生服务中心</SelectItem>
                      <SelectItem value="妇幼保健院">妇幼保健院</SelectItem>
                      <SelectItem value="儿童医院">儿童医院</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>非免疫规划疫苗选择（可选）</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                    {nonNipVaccines.map((vaccine) => (
                      <div key={vaccine.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={vaccine.id}
                          checked={selectedNonNipVaccines.includes(vaccine.id)}
                          onCheckedChange={(checked) => handleNonNipVaccineChange(vaccine.id, checked as boolean)}
                        />
                        <div>
                          <Label
                            htmlFor={vaccine.id}
                            className="font-medium cursor-pointer"
                          >
                            {vaccine.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">{vaccine.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="reminder"
                    checked={enableReminders}
                    onCheckedChange={setEnableReminders}
                  />
                  <Label htmlFor="reminder">启用接种提醒</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={generateSchedule}
                  disabled={!birthDate}
                  className="w-full"
                  size="lg"
                >
                  生成接种排期
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{babyName || "宝宝"}的疫苗接种排期</CardTitle>
                    <CardDescription>
                      出生日期：{birthDate ? formatDate(birthDate) : ''} | 接种单位：{vaccinationUnit}
                    </CardDescription>
                  </div>
                  {enableReminders && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleWechatReminder}
                      className="relative"
                    >
                      <Bell className="h-5 w-5" />
                      {wechatReminders.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {wechatReminders.length}
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupedSchedule).map(([ageStage, vaccines]) => (
                    vaccines.length > 0 && (
                      <div key={ageStage} className="space-y-2">
                        <h3 className="text-lg font-semibold">{ageStage}</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>接种日期</TableHead>
                              <TableHead>疫苗名称</TableHead>
                              <TableHead>剂次</TableHead>
                              <TableHead>状态</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {vaccines.map((vaccine, index) => (
                              <TableRow key={`${vaccine.vaccineId}-${vaccine.doseNumber}-${index}`}>
                                <TableCell>{formatDate(vaccine.scheduledDate)}</TableCell>
                                <TableCell>
                                  {vaccine.vaccineName}
                                  {!vaccine.isNIP && (
                                    <Badge variant="outline" className="ml-2">自费</Badge>
                                  )}
                                </TableCell>
                                <TableCell>第{vaccine.doseNumber}剂</TableCell>
                                <TableCell>
                                  {vaccine.isCompleted ? (
                                    <Badge variant="secondary">已完成</Badge>
                                  ) : (
                                    <Badge variant="default">待接种</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )
                  ))}

                  {/* 微信提醒模拟弹窗 */}
                  {showWechatReminder && wechatReminders.length > 0 && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
                        <div className="bg-green-600 text-white p-4 flex items-center">
                          <Bell className="h-6 w-6 mr-2" />
                          <h3 className="text-lg font-semibold">微信提醒</h3>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                          <div className="space-y-3">
                            {wechatReminders.map((reminder) => (
                              <div key={reminder.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{reminder.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      提醒日期: {formatDate(reminder.date)}
                                    </p>
                                  </div>
                                  {reminder.isRead ? (
                                    <Badge variant="outline">已读</Badge>
                                  ) : (
                                    <Badge>未读</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end">
                          <Button onClick={toggleWechatReminder}>关闭</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("input")}>
                  返回修改
                </Button>
                <Button onClick={saveSchedule}>
                  <Save className="mr-2 h-4 w-4" />
                  保存排期
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
