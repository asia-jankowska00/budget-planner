USE [1081550]
GO
ALTER TABLE [dbo].[bpUserSource] DROP CONSTRAINT [FK__bpUserSou__UserI__71D1E811]
GO
ALTER TABLE [dbo].[bpUserSource] DROP CONSTRAINT [FK__bpUserSou__Sourc__72C60C4A]
GO
ALTER TABLE [dbo].[bpUserContainer] DROP CONSTRAINT [FK__bpUserCon__UserI__787EE5A0]
GO
ALTER TABLE [dbo].[bpUserContainer] DROP CONSTRAINT [FK__bpUserCon__Conta__797309D9]
GO
ALTER TABLE [dbo].[bpUser] DROP CONSTRAINT [FK__bpUser__Currency__68487DD7]
GO
ALTER TABLE [dbo].[bpTransaction] DROP CONSTRAINT [FK__bpTransac__UserI__05D8E0BE]
GO
ALTER TABLE [dbo].[bpTransaction] DROP CONSTRAINT [FK__bpTransac__Sourc__06CD04F7]
GO
ALTER TABLE [dbo].[bpTransaction] DROP CONSTRAINT [FK__bpTransac__Categ__07C12930]
GO
ALTER TABLE [dbo].[bpSource] DROP CONSTRAINT [FK__bpSource__Curren__6EF57B66]
GO
ALTER TABLE [dbo].[bpSource] DROP CONSTRAINT [FK__bpSource__Curren__6E01572D]
GO
ALTER TABLE [dbo].[bpNotification] DROP CONSTRAINT [FK__bpNotific__UserI__0E6E26BF]
GO
ALTER TABLE [dbo].[bpLogin] DROP CONSTRAINT [LoginUser]
GO
ALTER TABLE [dbo].[bpGoal] DROP CONSTRAINT [FK__bpGoal__Containe__114A936A]
GO
ALTER TABLE [dbo].[bpContainerTransaction] DROP CONSTRAINT [FK__bpContain__Trans__0B91BA14]
GO
ALTER TABLE [dbo].[bpContainerTransaction] DROP CONSTRAINT [FK__bpContain__Conta__0A9D95DB]
GO
ALTER TABLE [dbo].[bpContainerSource] DROP CONSTRAINT [FK__bpContain__Sourc__7D439ABD]
GO
ALTER TABLE [dbo].[bpContainerSource] DROP CONSTRAINT [FK__bpContain__Conta__7C4F7684]
GO
ALTER TABLE [dbo].[bpContainerCategory] DROP CONSTRAINT [FK__bpContain__Conta__02084FDA]
GO
ALTER TABLE [dbo].[bpContainerCategory] DROP CONSTRAINT [FK__bpContain__Categ__02FC7413]
GO
ALTER TABLE [dbo].[bpContainer] DROP CONSTRAINT [FK__bpContain__UserI__75A278F5]
GO
/****** Object:  Table [dbo].[bpUserSource]    Script Date: 10-Sep-20 6:43:16 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpUserSource]') AND type in (N'U'))
DROP TABLE [dbo].[bpUserSource]
GO
/****** Object:  Table [dbo].[bpUserContainer]    Script Date: 10-Sep-20 6:43:16 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpUserContainer]') AND type in (N'U'))
DROP TABLE [dbo].[bpUserContainer]
GO
/****** Object:  Table [dbo].[bpUser]    Script Date: 10-Sep-20 6:43:16 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpUser]') AND type in (N'U'))
DROP TABLE [dbo].[bpUser]
GO
/****** Object:  Table [dbo].[bpTransaction]    Script Date: 10-Sep-20 6:43:16 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpTransaction]') AND type in (N'U'))
DROP TABLE [dbo].[bpTransaction]
GO
/****** Object:  Table [dbo].[bpSource]    Script Date: 10-Sep-20 6:43:16 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpSource]') AND type in (N'U'))
DROP TABLE [dbo].[bpSource]
GO
/****** Object:  Table [dbo].[bpNotification]    Script Date: 10-Sep-20 6:43:16 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpNotification]') AND type in (N'U'))
DROP TABLE [dbo].[bpNotification]
GO
/****** Object:  Table [dbo].[bpLogin]    Script Date: 10-Sep-20 6:43:17 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpLogin]') AND type in (N'U'))
DROP TABLE [dbo].[bpLogin]
GO
/****** Object:  Table [dbo].[bpGoal]    Script Date: 10-Sep-20 6:43:17 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpGoal]') AND type in (N'U'))
DROP TABLE [dbo].[bpGoal]
GO
/****** Object:  Table [dbo].[bpCurrency]    Script Date: 10-Sep-20 6:43:17 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpCurrency]') AND type in (N'U'))
DROP TABLE [dbo].[bpCurrency]
GO
/****** Object:  Table [dbo].[bpContainerTransaction]    Script Date: 10-Sep-20 6:43:17 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpContainerTransaction]') AND type in (N'U'))
DROP TABLE [dbo].[bpContainerTransaction]
GO
/****** Object:  Table [dbo].[bpContainerSource]    Script Date: 10-Sep-20 6:43:17 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpContainerSource]') AND type in (N'U'))
DROP TABLE [dbo].[bpContainerSource]
GO
/****** Object:  Table [dbo].[bpContainerCategory]    Script Date: 10-Sep-20 6:43:17 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpContainerCategory]') AND type in (N'U'))
DROP TABLE [dbo].[bpContainerCategory]
GO
/****** Object:  Table [dbo].[bpContainer]    Script Date: 10-Sep-20 6:43:17 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpContainer]') AND type in (N'U'))
DROP TABLE [dbo].[bpContainer]
GO
/****** Object:  Table [dbo].[bpCategory]    Script Date: 10-Sep-20 6:43:17 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpCategory]') AND type in (N'U'))
DROP TABLE [dbo].[bpCategory]
GO
