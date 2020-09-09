USE [1081601]
GO
ALTER TABLE [dbo].[bpUserSource] DROP CONSTRAINT [FK__bpUserSou__FK_bp__2D12A970]
GO
ALTER TABLE [dbo].[bpUserSource] DROP CONSTRAINT [FK__bpUserSou__FK_bp__2C1E8537]
GO
ALTER TABLE [dbo].[bpUserContainer] DROP CONSTRAINT [FK__bpUserCon__FK_bp__33BFA6FF]
GO
ALTER TABLE [dbo].[bpUserContainer] DROP CONSTRAINT [FK__bpUserCon__FK_bp__32CB82C6]
GO
ALTER TABLE [dbo].[bpUser] DROP CONSTRAINT [FK__bpUser__FK_bpCur__22951AFD]
GO
ALTER TABLE [dbo].[bpTransaction] DROP CONSTRAINT [FK__bpTransac__FK_bp__420DC656]
GO
ALTER TABLE [dbo].[bpTransaction] DROP CONSTRAINT [FK__bpTransac__FK_bp__4119A21D]
GO
ALTER TABLE [dbo].[bpTransaction] DROP CONSTRAINT [FK__bpTransac__FK_bp__40257DE4]
GO
ALTER TABLE [dbo].[bpSource] DROP CONSTRAINT [FK__bpSource__FK_bpC__2942188C]
GO
ALTER TABLE [dbo].[bpSource] DROP CONSTRAINT [FK__bpSource__FK_bpC__284DF453]
GO
ALTER TABLE [dbo].[bpNotification] DROP CONSTRAINT [FK__bpNotific__FK_bp__48BAC3E5]
GO
ALTER TABLE [dbo].[bpLogin] DROP CONSTRAINT [FK_Login_User]
GO
ALTER TABLE [dbo].[bpGoal] DROP CONSTRAINT [FK__bpGoal__FK_bpCon__4B973090]
GO
ALTER TABLE [dbo].[bpContainerTransaction] DROP CONSTRAINT [FK__bpContain__FK_bp__45DE573A]
GO
ALTER TABLE [dbo].[bpContainerTransaction] DROP CONSTRAINT [FK__bpContain__FK_bp__44EA3301]
GO
ALTER TABLE [dbo].[bpContainerSource] DROP CONSTRAINT [FK__bpContain__FK_bp__379037E3]
GO
ALTER TABLE [dbo].[bpContainerSource] DROP CONSTRAINT [FK__bpContain__FK_bp__369C13AA]
GO
ALTER TABLE [dbo].[bpContainerCategory] DROP CONSTRAINT [FK__bpContain__FK_bp__3D491139]
GO
ALTER TABLE [dbo].[bpContainerCategory] DROP CONSTRAINT [FK__bpContain__FK_bp__3C54ED00]
GO
ALTER TABLE [dbo].[bpContainer] DROP CONSTRAINT [FK__bpContain__FK_bp__2FEF161B]
GO
/****** Object:  Table [dbo].[bpUserSource]    Script Date: 09/09/2020 11:14:26 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpUserSource]') AND type in (N'U'))
DROP TABLE [dbo].[bpUserSource]
GO
/****** Object:  Table [dbo].[bpUserContainer]    Script Date: 09/09/2020 11:14:26 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpUserContainer]') AND type in (N'U'))
DROP TABLE [dbo].[bpUserContainer]
GO
/****** Object:  Table [dbo].[bpUser]    Script Date: 09/09/2020 11:14:26 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpUser]') AND type in (N'U'))
DROP TABLE [dbo].[bpUser]
GO
/****** Object:  Table [dbo].[bpTransaction]    Script Date: 09/09/2020 11:14:26 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpTransaction]') AND type in (N'U'))
DROP TABLE [dbo].[bpTransaction]
GO
/****** Object:  Table [dbo].[bpSource]    Script Date: 09/09/2020 11:14:26 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpSource]') AND type in (N'U'))
DROP TABLE [dbo].[bpSource]
GO
/****** Object:  Table [dbo].[bpNotification]    Script Date: 09/09/2020 11:14:26 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpNotification]') AND type in (N'U'))
DROP TABLE [dbo].[bpNotification]
GO
/****** Object:  Table [dbo].[bpLogin]    Script Date: 09/09/2020 11:14:26 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpLogin]') AND type in (N'U'))
DROP TABLE [dbo].[bpLogin]
GO
/****** Object:  Table [dbo].[bpGoal]    Script Date: 09/09/2020 11:14:26 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpGoal]') AND type in (N'U'))
DROP TABLE [dbo].[bpGoal]
GO
/****** Object:  Table [dbo].[bpCurrency]    Script Date: 09/09/2020 11:14:27 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpCurrency]') AND type in (N'U'))
DROP TABLE [dbo].[bpCurrency]
GO
/****** Object:  Table [dbo].[bpContainerTransaction]    Script Date: 09/09/2020 11:14:27 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpContainerTransaction]') AND type in (N'U'))
DROP TABLE [dbo].[bpContainerTransaction]
GO
/****** Object:  Table [dbo].[bpContainerSource]    Script Date: 09/09/2020 11:14:27 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpContainerSource]') AND type in (N'U'))
DROP TABLE [dbo].[bpContainerSource]
GO
/****** Object:  Table [dbo].[bpContainerCategory]    Script Date: 09/09/2020 11:14:27 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpContainerCategory]') AND type in (N'U'))
DROP TABLE [dbo].[bpContainerCategory]
GO
/****** Object:  Table [dbo].[bpContainer]    Script Date: 09/09/2020 11:14:27 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpContainer]') AND type in (N'U'))
DROP TABLE [dbo].[bpContainer]
GO
/****** Object:  Table [dbo].[bpCategory]    Script Date: 09/09/2020 11:14:27 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[bpCategory]') AND type in (N'U'))
DROP TABLE [dbo].[bpCategory]
GO
